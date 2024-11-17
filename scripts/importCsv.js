require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const csv = require('csv-parser');
const fs = require('fs');

// Supabaseクライアントの初期化
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY);

// ストレージバケットとテーブル名の指定
const bucketName = 'csv_files'; // ストレージバケット名
const tableName = 'match_history'; // データベーステーブル名
const historyTableName = 'import_history'; // 履歴管理テーブル名

async function importCsvFiles() {
  try {
    // ストレージ内のファイルリストを取得
    const { data: files, error: listError } = await supabase.storage.from(bucketName).list();

    if (listError) throw listError;

    console.log(`Found ${files.length} files in bucket "${bucketName}"`);

    for (const file of files) {
      console.log(`Processing file: ${file.name}`);

      // ファイルがすでにインポート済みか確認
      const { data: historyData, error: historyError } = await supabase
        .from(historyTableName)
        .select('file_name')
        .eq('file_name', file.name)
        .single();

      if (historyData) {
        console.log(`File ${file.name} already imported. Skipping.`);
        continue;
      }

      if (historyError && historyError.code !== 'PGRST116') { // 'PGRST116' = not found
        console.error(`Error checking import history for file ${file.name}:`, historyError.message);
        continue;
      }

      // ファイルをダウンロード
      const { data: fileData, error: downloadError } = await supabase.storage.from(bucketName).download(file.name);

      if (downloadError) {
        console.error(`Failed to download file ${file.name}:`, downloadError.message);
        continue;
      }

      // ArrayBufferをBufferに変換
      const buffer = Buffer.from(await fileData.arrayBuffer());

      // 一時ファイルとして保存
      const tempFilePath = `./temp_${file.name}`;
      fs.writeFileSync(tempFilePath, buffer);

      // CSVファイルを解析してデータベースに挿入
      const rows = [];
      fs.createReadStream(tempFilePath)
        .pipe(csv())
        .on('data', (row) => {
          // 空の値を`null`に変換
          Object.keys(row).forEach((key) => {
            if (row[key] === '') {
              row[key] = null; // 空文字をnullに変換
            }
          });

          // IDカラムを削除（データベースが自動生成）
          delete row.id;

          rows.push(row); // 検証済みデータを追加
        })
        .on('end', async () => {
          console.log(`Parsed ${rows.length} valid rows from ${file.name}`);

          if (rows.length > 0) {
            // データをバッチ挿入
            const { error: insertError } = await supabase.from(tableName).insert(rows, { returning: 'minimal' });

            if (insertError) {
              console.error(`Failed to insert data from ${file.name}:`, insertError.message);
            } else {
              console.log(`Successfully imported ${file.name}`);

              // 履歴テーブルに登録
              const { error: historyInsertError } = await supabase
                .from(historyTableName)
                .insert([{ file_name: file.name }]);

              if (historyInsertError) {
                console.error(`Failed to update import history for file ${file.name}:`, historyInsertError.message);
              } else {
                console.log(`Import history updated for file ${file.name}`);
              }
            }
          } else {
            console.warn(`No valid rows found in ${file.name}, skipping insert.`);
          }

          // 一時ファイルを削除
          fs.unlinkSync(tempFilePath);
        });
    }
  } catch (error) {
    console.error('Error during import process:', error.message);
  }
}

importCsvFiles();

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'timing.json');

try {
  // 1. ファイルを読み込む
  const rawData = fs.readFileSync(targetPath, 'utf8');
  const data = JSON.parse(rawData);

  // 2. idとstartFrameを順番に振り直す
  if (data.segments && Array.isArray(data.segments)) {
    let currentFrame = 0;
    data.segments.forEach((segment, index) => {
      segment.id = index + 1;
      segment.startFrame = currentFrame;
      currentFrame += segment.durationInFrames || 0;
    });
    // 全体の合計フレーム数も更新しておく
    data.totalDurationInFrames = currentFrame;
  }

  // 3. 上書き保存する (インデントを2スペースに設定)
  fs.writeFileSync(targetPath, JSON.stringify(data, null, 2) + '\n');
  console.log('✅ timing.json の id番号を振り直しました！');
  
} catch (error) {
  console.error('❌ エラーが発生しました:', error.message);
}

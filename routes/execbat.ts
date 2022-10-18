import { Router } from 'express';
import PropertiesReader from 'properties-reader';

export const router = Router();

router.post('/', (req, res, next) => {
  // ログ出力
  console.log(req.body);

  // parameter
  const input = req.body['input'];
  const output = req.body['output'];

  // iniファイル修正
  modifyIni(input, output).then(
    (data) => {
      // 修正に成功した場合、バッチを実行する
      if (execBat()) {
        res.send('BatchOK');
      } else {
        res.send('BatchNG');
      }
    },
    (err) => {
      // 修正に失敗した場合
      console.log('ini modify error');
      res.send('IniModifyNG');
    }
  );
});

// ini書き換え
const modifyIni = (input: string, output: string) => {
  const iniPath = './bat/sample.ini';
  const props = PropertiesReader(iniPath);

  props.set('csv.input', input);
  props.set('csv.output', output);

  return props.save(iniPath);
};

// バッチ実行
const execBat = () => {
  const appPath = '.\\bat\\sample.bat';
  const argument = '';
  const cmd = appPath + ' ' + argument;

  try {
    // バッチ実行
    const stdout = require('child_process').execSync(cmd);
    console.log(toString(stdout));
  } catch (e) {
    console.log('バッチ実行エラー');
    console.log(e);
    return false;
  }

  return true;
};

const toString = (bytes: Buffer) => {
  const Encoding = require('encoding-japanese');
  return Encoding.convert(bytes, {
    from: 'SJIS',
    to: 'UNICODE',
    type: 'string',
  });
};

const fs = require('fs');
const ejs = require('ejs');
const csvParse = require('csv-parse/lib/sync');
const moment = require('moment');
const { exec } = require('child_process');

moment.locale('es');

const outputFile = process.argv[2] || 'planilla.pdf';
const weasyprint = exec(`weasyprint - ${outputFile}`);

const configFile = process.argv[3] || 'config.json';
const options = processOptions(JSON.parse(fs.readFileSync(configFile)));

const template = fs.readFileSync('planilla.ejs').toString();
weasyprint.stdin.write(ejs.render(template, options));
weasyprint.stdin.end();


function processOptions(options) {
  const expandString = (str) => str
    .replace(/\$date\(([^\)]*)\)/, (_, d) => moment(new Date(d)).format('D [de] MMMM [de] YYYY'))
    .replace(/\$date/, moment().format('D [de] MMMM [de] YYYY'));

  const processedOptions = Object.assign({}, options);

  ['title', 'columns'].forEach((option) => {
    if (!options[option]) {
      throw Error("Required option 'title' is missing");
    }
  });
  
  if (Array.isArray(options.title)) {
    processedOptions.title = options.title.map(t => expandString(t));
  } else {
    processedOptions.title = expandString(options.title);
  }
  if (options.subtitle) {
    processedOptions.subtitle = expandString(options.subtitle);
  }

  processedOptions.columns.forEach((c) => {
    if (c.text) c.text = expandString(c.text);
    if (c.subcols) {
      c.subcols.forEach((s) => {
        if (s.text) s.text = expandString(s.text);
      });
    }
  });
  
  if (typeof options.rows === 'string') {
    processedOptions.rows = csvParse(fs.readFileSync(options.rows), { columns: true });
  } else {
    const rowCount = typeof options.rows === 'number'
      ? options.rows
      : options.columns.some(c => c.subcols) ? 61 : 63;
    processedOptions.rows = Array(rowCount).fill({});
  }

  return processedOptions;
}

#! /usr/local/bin/node

var csvStringify = require('csv-stringify');
var xml2js = require('xml2js');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var parseString = new xml2js.Parser().parseString;
var dir = path.join(process.cwd(), process.argv[2]);

var csvObject = [[
  "Nota Fiscal",
  "Número da Nota",
  "Data e Hora de Emissão",
  "Mês de Emissão",
  "Dia de Emissão",
  "CNH do Motorista",
  "Bairro de Origem",
  "Município de Origem",
  "Bairro de Destino",
  "Município de Destino",
  "Carreta",
  "Peso"
]];


if (dir) {
  fs.readdir(dir, function(err, filetree) {
    filetree.forEach(function(filename) {
      if (filename.substr(-3) === "xml") {
        fs.readFile(path.join(dir,filename), function(err, file) {
          parseString(file, function(err, result) {
            csvObject.push([
              filename,
              result.nfeProc.NFe[0].infNFe[0].ide[0].nNF[0],
              moment(result.nfeProc.NFe[0].infNFe[0].ide[0].dhEmi[0]).format('YYYY/MM/DD HH:mm'),
              moment(result.nfeProc.NFe[0].infNFe[0].ide[0].dhEmi[0]).format('MM'),
              moment(result.nfeProc.NFe[0].infNFe[0].ide[0].dhEmi[0]).format('DD'),
              result.nfeProc.NFe[0].infNFe[0].infAdic[0].infCpl[0].match(/CNH:[0-9]+/g)[0].substr(4),
              result.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xBairro[0],
              result.nfeProc.NFe[0].infNFe[0].emit[0].enderEmit[0].xMun[0],
              result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xBairro[0],
              result.nfeProc.NFe[0].infNFe[0].dest[0].enderDest[0].xMun[0],
              result.nfeProc.NFe[0].infNFe[0].transp[0].veicTransp[0].placa[0].replace("-", ""),
              result.nfeProc.NFe[0].infNFe[0].transp[0].vol[0].pesoB[0]
            ])

            csvStringify(csvObject, function(err, output){
              fs.writeFile(path.join(dir,'notas.csv'), output, function (err) {
                if (err) throw err;
              });
            });
          });
        })
      }
    });
  });
} else {
  console.log('ERRO: Esqueceu de dizer o caminho do diretório onde estão as notas.');
}

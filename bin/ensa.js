#!/usr/bin/env node
var yargs = require('yargs');
var Registrar = require('../lib/ensAuction');
var Web3 = require("web3");

var args = yargs
  .command('bid', 'Place a bid on a domain name', function(yargs) {
    return yargs.option('host', {
      description: "HTTP host of Ethereum node",
      alias: 'h',
      default: 'testrpc'
    })
    .option('port', {
      description: "HTTP port",
      alias: 'p',
      default: '8545'
    })
    .option('registrar', {
      description: "The address of the registrar",
      alias: 'r',
      type: 'string'
    })
    .option('name', {
      description: "The name you want to register",
      alias: 'n',
      type: "string"
    })
    .option('account', {
      description: "The address to register the domain name",
      alias: 'a',
      type: "string"
    })
    .option('max', {
      description: "The maximum amount willing to pay for the name, in Ether",
      alias: 'm',
      type: 'string'
    })
    .option('secret', {
      description: "The secret `salt` for unsealing your bid",
      alias: 's',
      type: 'string'
    })
    .demand(['account', 'max', 'secret', 'name', 'registrar'])
  })
  .command('reveal', 'Reveal your bid on a domain name', function(yargs) {
    return yargs.option('host', {
      description: "HTTP host of Ethereum node",
      alias: 'h',
      default: 'testrpc'
    })
    .option('port', {
      description: "HTTP port",
      alias: 'p',
      default: '8545'
    })
    .option('name', {
      description: "The name you want to register",
      alias: 'n',
      type: "string"
    })
    .option('account', {
      description: "The address to register the domain name",
      alias: 'a',
      type: "string"
    })
    .option('max', {
      description: "The maximum amount willing to pay for the name, in Ether",
      alias: 'm',
      type: 'string'
    })
    .option('secret', {
      description: "The secret `salt` for unsealing your bid",
      alias: 's',
      type: 'string'
    })
    .demand(['account', 'max', 'secret', 'name'])
  })
  .help()
  .usage("Usage: $0 [command] [options]");

var argv = args.argv;

if (argv._.length == 0) {
  args.showHelp();
}

var command = argv._[0];

if (command == 'bid') {
  var provider = new Web3(new Web3.providers.HttpProvider("http://" + argv.host + ":" + argv.port));
  provider.eth.defaultAccount = argv.account;
  var registrar = new Registrar(provider, argv.registrar, argv.account);
  registrar.createBid(argv.name, argv.account, argv.max, argv.secret, function() {
    console.log("Created bid.");
  });
}

#!/usr/bin/env node
var yargs = require('yargs');
var auctionRegistar = require('../lib/ensAuction');

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
    .option('salt', {
      description: "The secret 'salt' for unsealing your bid",
      alias: 's',
      type: 'string'
    })
    .demand(['account', 'max', 'salt', 'name'])
  })
  .help()
  .usage("Usage: $0 [command] [options]");

var argv = args.argv;

if (argv._.length == 0) {
  args.showHelp();
}

var command = argv._[0];

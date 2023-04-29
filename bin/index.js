#!/usr/bin/env node
// reference Article https://medium.com/jspoint/making-cli-app-with-ease-using-commander-js-and-inquirer-js-f3bbd52977ac 
import chalk from "chalk";
import boxen from "boxen";
import axios from "axios";
import Table from "cli-table";
import { Command } from "commander";
import inquirer from "inquirer";
import yargs from 'yargs';
const program = new Command();
const greeting = chalk.white.bold("Hello!");
const prompt = inquirer.createPromptModule();
let current_page = 1 ;
const currency = 'PKR'; 
const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
  backgroundColor: "#555555",
  textAlignment: "center",
  width: 100,
};
const msgBox = boxen(greeting, { ...boxenOptions });

console.log(msgBox);
async function getCoins(){
  const {
    data
  } = await axios.get(
   `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=${current_page}&sparkline=false&locale=en`
  );
  return data ;
}
function printCoins(data){
  var table = new Table({
    head: ["Id","Symbol", "Name" , `Price (${currency})`],
    colWidths: [20 ,10, 30, 20],
    chars: {
      top: "═",
      "top-mid": "╤",
      "top-left": "╔",
      "top-right": "╗",
      bottom: "═",
      "bottom-mid": "╧",
      "bottom-left": "╚",
      "bottom-right": "╝",
      left: "║",
      "left-mid": "╟",
      mid: "─",
      "mid-mid": "┼",
      right: "║",
      "right-mid": "╢",
      middle: "│",
    },
  });
  data.map(({ id,name, symbol,current_price }) => {
    table.push([id , symbol, name,current_price]);
  });

  console.log(table.toString());
}
const listCoins = async () => {
let data = await  getCoins();
console.log('I am Called Waleed Bhai');

printCoins(data);
  prompt([
    {
      type : 'confirm',
      name :'more',
      message : 'Do you want to get more coins ?',
      default:true 
    }

  ]).then(async ({more})=>{
if(more){
current_page++;
listCoins();

}
  }).catch((error)=>{
console.log(error);
  })
};

const getCoinData = async (id) => {
 const {data: {name ,block_time_in_minutes , hashing_algorithm , image :{large} , market_cap_rank, last_updated}}  = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false&sparkline=true`);
 console.table( {name ,block_time_in_minutes , hashing_algorithm , image :{large} , market_cap_rank, last_updated});
};
// getCoinInfo();

// listCoins();
program.command('list').alias('ls').description('List All Coins').action(()=>{
listCoins();
});
program.command('coin').alias('c').description('Enter The Id of coin you need real time data of').option('-i,--id [value]', 'Coin Id', 'bitcoin').action(function({id} , argvs){
getCoinData(id);

})
program.parse(process.argv);
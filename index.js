"use strict";

let accounts = {
    account1: {balance: 100},
    account2: {balance: 50}
};

let events = [
    {type: "open", id: "account1", balance: 150, time: 0},
    {type: "open", id: "account2", balance: 0, time: 1},
    {type: "transfer", fromId: "account1", toId: "account2", amount: 50, time: 2}
];

//accumulator
//value

accounts = events.reduce((accounts, event) => {
    if(event.type === "open"){                
        accounts[event.id] = {};
        accounts[event.id].balance = parseInt(event.balance);
    }else if(event.type === "transfer"){        
        accounts[event.fromId].balance -= event.amount;
        accounts[event.toId].balance += event.amount;
    }
    return accounts;
}, {});

console.log(accounts);


function getAccountsAtTime(time){
    return events.reduce((accounts, event) => {
        if(time > event.time){
            return accounts;
        }
        if(event.type === "open"){
            accounts[event.id] = {};
            accounts[event.id].balance = event.balance;
        }else if(event.type === "transfer"){            
            accounts[event.fromId] -= event.amount;
            accounts[event.toId] += event.amount;
        }
        return accounts;
    }, {});
}

 accounts = getAccountsAtTime(0);
 console.dir(accounts);
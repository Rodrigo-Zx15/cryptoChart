//global variables
const updateTimeMs = 30000;
let cryptos = ['eth'];
class Crypto {
    constructor(label, color, dataIndex, data){
        this.label = label;
        this.backgroundColor = color;
        this.borderColor = color;
        this.data[dataIndex] = data;
    }
    // label = 'TESTE-R$';
    // backgroundColor = 'rgb(55, 99, 232)';
    // borderColor = 'rgb(55, 99, 232)';
    data = [];
    fill = {
        Disable: true
    }
}

//querySelectors
const addCurrencyButton = document.querySelector('#confirm');
const timeCounter = document.querySelector('#seconds');
timeCounter.innerText = updateTimeMs/1000;

//functions
async function getValue(crypto){
    let req = await axios.get(`https://api.cryptonator.com/api/ticker/${crypto}-brl`);
    let value = req.data.ticker.price;
    console.log(req.data);
    return value;
}


function addData(chart, label, data, dataset) {
    chart.data.labels.push(label);
    chart.data.datasets[dataset].data.push(data);
    chart.update();
}
//needed to avoid duplicated labels
function addData2(chart, data, dataset){
    chart.data.datasets[dataset].data.push(data);
    chart.update();
}

function randomRGB(){
    let r = Math.floor(Math.random() * Math.floor(256));
    let g = Math.floor(Math.random() * Math.floor(256));
    let b = Math.floor(Math.random() * Math.floor(256));
    let rgbString = `rgb(${r},${g},${b})`;
    console.log(rgbString);
    return rgbString;
}

//initial data
window.addEventListener('load',async()=>{
    let initialValue = await getValue(cryptos[0]);
    addData(chart,'',initialValue,0);
})



//updates
addCurrencyButton.addEventListener('click', async (event)=>{
    const opt = document.querySelector('#cryptoSelector');
    event.preventDefault();
    let newLabel = opt.value;
    let newValue = await getValue(newLabel);
    cryptos.push(newLabel)
    newLabel = newLabel.toUpperCase() + '-R$';
    let currLength = chart.data.labels.length;
    
    console.log(newLabel, newValue);
    let newCrypto = new Crypto(newLabel,randomRGB(),currLength-1,newValue);
    ;
    chart.data.datasets.push(newCrypto);    
    chart.update();
    opt.options[opt.options.selectedIndex].setAttribute('disabled','disabled');
    opt.options.selectedIndex = opt.options.selectedIndex+1; 
});

window.setInterval(async()=>{
    let timeStamp = new Date();
    timeStamp = timeStamp.toLocaleTimeString('pt-BR');
    let i = 0;   
    for(const crypto of cryptos){  
        let newValue = await getValue(crypto);
        console.log(timeStamp, newValue);
        if(i > 0){
            addData2(chart,newValue,i);
        }else{
            addData(chart,timeStamp,newValue,i);
        } 
        i++;
    }
    
},updateTimeMs);
window.setInterval(async ()=>{
    let remainingTime = timeCounter.innerText;
    timeCounter.innerText = remainingTime-1;
    if(remainingTime == 0){
        timeCounter.innerText = updateTimeMs/1000;
    }
},1000);

//chart
const ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [
            {
            label: 'ETH-R$',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [],
            fill: {
                Disable: true
                }
            }
        ]
    },
    // Configuration options go here
    options: {
        scales:{
            yAxes:[{
                ticks:{
                    min: 2000,
                    max: 15000,
                    stepSize: 100
                }
            }]
        }
    }
});
function chartInit(chart, floor, steps){
    chart.options = {
        scales:{
            yAxes: [{
                ticks:{
                    min: floor,                  
                    stepSize: steps
                }
            }]
        }
    };
    chart.update();
};









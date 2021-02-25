//#GV - global variables
const updateTimeMs = 30000;
let currentCryptos = ['eth'];
class Crypto {
    constructor(label, color, dataIndex, data){
        this.label = label;
        this.backgroundColor = color;
        this.borderColor = color;
        this.data[dataIndex] = data;
    }

    data = [];
    fill = {
        Disable: true
    }
}

//#QS - querySelectors
const addCurrencyButton = document.querySelector('#confirm');
const timeCounter = document.querySelector('#seconds');
const opt = document.querySelector('#cryptoSelector');
timeCounter.innerText = updateTimeMs/1000;

//#FC - functions
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
function addDataToExistingSets(chart, data, dataset){
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
async function createNewCrypto(){
    
    let label = opt.value;
    let value = await getValue(label);
    currentCryptos.push(label)
    label = label.toUpperCase() + '-R$';
    let chartLength = chart.data.labels.length;
    
    console.log(label, value);
    let newCrypto = new Crypto(label,randomRGB(),chartLength-1,value);

    return newCrypto;
}
//Chart's initial data
window.addEventListener('load',async()=>{
    let initialValue = await getValue(currentCryptos[0]);
    addData(chart,'',initialValue,0);
})



//#UPD - Chart updates
addCurrencyButton.addEventListener('click', async (event)=>{
    
    event.preventDefault();
    let newCrypto = await createNewCrypto();
    chart.data.datasets.push(newCrypto);    
    chart.update();
    opt.options[opt.options.selectedIndex].setAttribute('disabled','disabled');
    opt.options.selectedIndex = opt.options.selectedIndex+1; 
});

window.setInterval(async()=>{
    let timeStamp = new Date();
    timeStamp = timeStamp.toLocaleTimeString('pt-BR');
    let i = 0;   
    for(const crypto of currentCryptos){  
        let newValue = await getValue(crypto);
        console.log(timeStamp, newValue);
        if(i > 0){
            addDataToExistingSets(chart,newValue,i);
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
const mainChart = document.getElementById('myChart').getContext('2d');
let chart = new Chart(mainChart, {
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
        // scales:{
        //     yAxes:[{
        //         ticks:{
        //             min: 2000,
        //             max: 15000,
        //             stepSize: 100
        //         }
        //     }]
        // }
    }
});









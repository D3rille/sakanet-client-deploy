import React from 'react';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    Title, 
    Tooltip, 
    Legend
    );

const SalesOrOrdersStats = ({ data, showStatOf, timeInterval }) => {
    const months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let labels;
    
    // Condition to set label depending on showStatOf daily, weekly, Monthly, Yearly
    if(timeInterval == "daily" ){
        labels = data.map(item=>`${item._id.year} - ${item._id.month} - ${item._id.day}`);
    } else if(timeInterval == "weekly"){
        labels = data.map(item=>`${item._id.year} - Week ${item._id.week}`);
    } else if(timeInterval == "monthly"){
        labels = data.map(item=>`${months[item._id.month]} ${item._id.year}`);
    } else if(timeInterval == "annual"){
        labels = data.map(item=>item._id.year);
    }

    console.log(labels);
    const dataset1 = {
        label: showStatOf == "sales" ? 'Total Sales' : "Total Orders",
        data: data.map(item => item.totalValue),
        borderColor: '#186F65',//'rgb(255, 99, 132)'
        backgroundColor: '#186F65',//'rgba(255, 99, 132, 0.5)',
    };
    
    const options = {
        responsive: true,
        plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: showStatOf == "sales" ? 'Daily Sales Chart': 'Daily Orders Chart',
        },
        },
        scales: {
        y: {
            beginAtZero: true,
            axis: 'y',
            title: {
            display: true,
            text: showStatOf == "sales" ? 'Amount (Peso)':"Number of Orders",
            },
            ticks: {
            callback: value => `${value.toFixed(2)}`, // Format the ticks if needed
            },
        },
        },
    };
    
    return <Line options={options} data={{ labels, datasets: [dataset1] }} />;
};

export default SalesOrOrdersStats;
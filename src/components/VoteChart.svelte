<script>
    import { Bar } from 'svelte-chartjs';
  
    export let data = {};
    export let options = {};

    import {
      Chart,
      Title,
      Tooltip,
      Legend,
      BarElement,
      CategoryScale,
      LinearScale,
    } from 'chart.js';
  
    Chart.register(
      Title,
      Tooltip,
      Legend,
      BarElement,
      CategoryScale,
      LinearScale
    );
  </script>
  
  <Bar {data} {options} />
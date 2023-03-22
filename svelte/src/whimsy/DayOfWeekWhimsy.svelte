<script lang="ts">  
  import { now } from "../Schedule/now";
  let days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  let hide = true;
  let dayNum : number;
  $: dayNum = $now.getDay();
  
</script>
<p on:animationstart={()=>hide=false} class:hide>Today is {days[dayNum]}</p>



<style>
  p {
    animation-name : zoom-in;
    animation-duration: 1s;    
    animation-delay: 2s;
    animation-timing-function: ease-in-out;
    transform-origin: center;
    display: grid;
    place-content: center;
    font-size: 3rem;
    text-align: center;   
  }
  @keyframes zoom-in {
    0% {
      transform: scale(0)translateY(100px);
      opacity: 0;
    }    
    90% {
      transform: scale(1.8)translateY(-10px)rotate(5deg);
    }
    100% {
      transform: scale(1)translateY(0);
    }
  }
  .hide {
    opacity: 0;
  }
</style>

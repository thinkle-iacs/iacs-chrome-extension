<script>
  import { onMount } from "svelte";
  let animator
  onMount(
    ()=>{
      animator = setInterval(
        ()=>{
          
          if (displayPercentage < percentage) {
            let diff = (percentage - displayPercentage);
            let delta = Math.ceil(1000*(diff/20))/1000
            displayPercentage += delta;
          }
          console.log('Creep up...',displayPercentage)
          if (displayPercentage > percentage) {
            displayPercentage = percentage;
            console.log('Done!')
            clearInterval(animator);
          }
        },
        50
      )
      return ()=>clearInterval(animator);
    }
  )
  
  export let percentage;
  let displayPercentage = 0;
  let grainsOfSand = 1000;
  
  function randomColor () {
    let colorList = [
      /* '--material-color-brown-500',
      '--material-color-brown-600',
      '--material-color-brown-700',
      '--material-color-brown-800', */
      '--material-color-yellow-700',
      '--material-color-yellow-800',
      '--material-color-yellow-900',
      '--material-color-deep-orange-500',
      '--material-color-deep-orange-600',
      
    ];
    let index = Math.floor(Math.random()*colorList.length);
    return colorList[index];
  }

  function makeGrains () {
    let grains = [];
    for (let n=0; n<grainsOfSand; n++) {
      grains.push({id:n,x:undefined,y:0,top:true,color:`var(${randomColor()}`});      
    }
    return grains;
  }
  let lastOnTop = 0;
  let grains = makeGrains(grainsOfSand);
  calculateGrainPositions(displayPercentage);
  $: calculateGrainPositions(displayPercentage);
  function calculateGrainPositions (percentage) {    
    let numberOnBottom = Math.floor(grains.length*percentage);
    let numberOnTop = grains.length - numberOnBottom;    
    if (numberOnTop != lastOnTop) {
      console.log('Grain chnge!',numberOnTop);
      lastOnTop = numberOnTop;
    }
    for (let i=0; i<grains.length; i++) {
      if (i < numberOnBottom) {
        // Bottom
        let nthOnBottom = numberOnBottom - i;
        grains[i].y = .95 - 0.34*(nthOnBottom/grainsOfSand);    
        if (grains[i].top) {
          grains[i].falling = true;
        }
        grains[i].top = false;    
      } else {
        // Top...
        let nthOnTop = numberOnTop - (numberOnTop - (i - numberOnBottom)); 
        grains[i].y = .5 - 0.34*(nthOnTop/grainsOfSand);        
        grains[i].top = true;
      }
      if (grains[i].x == undefined || grains[i].falling) {
        grains[i].x = Math.random() * 1;
        grains[i].falling = false;        
      }
      
      let distanceFromCenter = Math.abs(grains[i].y - 0.5);
      if (Math.abs(0.5 - grains[i].x) > distanceFromCenter) {        
        grains[i].x = 0.5 + (distanceFromCenter * (Math.random()-0.5));
      }
    }    
  }
</script>
<section class="hourglass">
  {#each grains as g (g.id)}
    <div class="grain" style:--x={g.x} style:--y={g.y} style:--color={g.color}></div>
  {/each}  
</section>

<style>
  .hourglass {
    --width: 50px;
    --height: 100px;
    --color: white;
    --triangle-factor : 1.83;
    width: var(--width);
    height: var(--height);  
    position: relative;  
  }
  .grain {
    transition: transform 400ms;
    --grainsize : calc(var(--height)/20);
    box-sizing: border-box;
    width: var(--grainsize);
    height: var(--grainsize);
    transform: translateX(calc(var(--x)*var(--width)))translateY(calc(var(--y)*var(--height)));
    height: calc(var(--height)/100);
    position: absolute;    
    z-index: 2;
    top: calc(-0.5*var(--grainsize));
    left: calc(-0.5*var(--grainsize));
    border-style: solid;
    border-radius: 50%;
    border-color: var(--color);
    border-width: 3px;
  }
  .hourglass::before {
    content: " ";
    width: 0;    
    height: 0;
    border-style: solid;
    border-top-width: calc(var(--height)/var(--triangle-factor));
    border-left-width: calc(1.2*var(--width)/2);
    border-right-width: calc(1.2*var(--width)/2);
    border-bottom: 0;
    border-color: transparent;
    border-top-color: var(--color);

    position: absolute;
    top: 0;
    left: -10%;  
    border-top-left-radius: 20%;  
    border-top-right-radius: 20%;  
  }
.hourglass::after {
    content: " ";
    width: 0;
    height: 0;
    border-style: solid;
    border-bottom-width: calc(var(--height)/var(--triangle-factor));
    border-left-width: calc(1.2*var(--width)/2);
    border-right-width: calc(1.2*var(--width)/2);
    border-top: 0;
    border-color: transparent;
    border-bottom-color: var(--color);
    position: absolute;
    bottom: 0;
    left: -10%;  
    border-bottom-left-radius: 20%;  
    border-bottom-right-radius: 20%;  
  }
</style>
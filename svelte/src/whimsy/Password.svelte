<script lang="ts">
let pass:string = "";

const checkPass = () => {
    console.log(pass.toLowerCase())
    if (pass.toLowerCase() === "silksong") {
        const shaw = new Audio("/shaw.mp3")
        shaw.play()
    } if (pass.toLowerCase() === "snow") {
        window.location.href = "#snow";
    } if (pass.toLowerCase() === "halloween") {
        window.location.href = "#halloween"
    } if (pass.toLowerCase() === "tipbuilder") {
        window.location.href = "#tipbuilder"
    } if (pass.toLowerCase() === "github") {
        window.location.href = "https://github.com/thinkle-iacs/iacs-chrome-extension"
    } if (pass.toLowerCase() === "") {
        window.alert("Maybe the password shouldn't be empty? hint: try `github`")
    } if (pass.toLowerCase() === "password") {
        window.alert("quick! i don't have much time! the staff wifi password is-")
    } 
    pass=""
}
</script>

<input bind:value={pass}  />
<button on:click={checkPass}>Submit</button>
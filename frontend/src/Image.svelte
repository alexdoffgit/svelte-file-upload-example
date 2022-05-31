<script lang="ts">
import axios from "axios";

export let params: Record<string, string>

let image: HTMLImageElement
let inputFile: HTMLInputElement
let fileChanged = false

async function fetchImage() {
    let res = await axios.get(`http://localhost:3000/image/${params.id}`, {
        responseType: 'blob'
    })
    let data = res.data
    const reader = new FileReader()

    function imageSetter() {
        image.setAttribute('src', reader.result as string)
    }

    reader.addEventListener('load', imageSetter)
    reader.readAsDataURL(data)
}

function handleFile() {
    const file = inputFile.files[0]

    if(file) {
        const reader = new FileReader()
        
        function imageSetter() {
            image.setAttribute('src', reader.result as string)
        }
        reader.addEventListener('load', imageSetter)
        reader.readAsDataURL(file)
        fileChanged = true
    }
}

function submitFile() {
    let form = new FormData()
    form.append("file", inputFile.files[0])
    axios({
        method: 'POST',
        url: 'http://localhost:3000/image',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
        console.log(res)
    }).catch(err => {
        console.log(err)
    })
}

</script>

{#await fetchImage()}
    <p>loading...</p>
{:then} 
    <img bind:this={image} alt={params.id}>
    <input type="file" bind:this={inputFile} on:change={handleFile}>
    <button disabled={!fileChanged} on:click={submitFile}>Submit File</button>
{/await}

<template>
    <div class="item" @click="$emit('addToPlaylist',item)">
        <div class="thumb" :style="{ backgroundImage: 'url(' + item.snippet.thumbnails.default.url + ')' }"></div>
        <div class="addBtn"></div>
        <div class="details">
            <div class="title">
                {{item.snippet.title}}
            </div>
            <div class="description">
                {{item.snippet.description}}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SearchItem',
    props: ['item']
}
</script>

<style scoped>
.item {
    margin-top: 12px;
    width: 100%;
    height: 80px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.9);
    cursor: pointer;
    overflow: hidden;
}

.thumb {
    width: 80px;
    height: 100%;
    background-size: cover;
    background-position: center;
    display: block;
    float: left;
}

.details {
    text-overflow: clip;
    overflow: hidden;
    padding-left: 10px;
    color: white;
    font-family: 'pixelated';
}

.title {
    width: 100%;
    font-size: 25px;
    text-align: left;
}

.description {
    width: 100%;
    line-height: 17px;
    text-align: left;
}

.addBtn {
    background-image: url('../../graphics/plus.png');
    width: 80px;
    height: 80px;
    float: right;
    background-repeat: no-repeat;
    background-position: center;
    border-left: 1px solid grey;
}
</style>

<template>
    <div class="item" @click="$emit('addToPlaylist',item)">
        <img class="thumb" :src="item.snippet.thumbnails.default.url">
        <div class="details">
            <div class="title">
                <h3> {{item.snippet.title}} </h3>
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
    width: 100%;
    min-height: 80px;
    background-color: rgba(0,0,0, 0.1);
    cursor: pointer;
}

.thumb {
    width: 80px;
    height: 80px;
    display: block;
    float: left;
}

.details {
    margin-left: 80px;
}

.title {
    width: 100%;
    text-align: left;
}

.description {
    width: 100%;
    text-align: left;
}
</style>

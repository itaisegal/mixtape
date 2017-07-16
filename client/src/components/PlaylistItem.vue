<template>
    <div @click="$emit('playSong', item)">
        <h2>{{item.snippet.title}}</h2>
        <h3>{{item.snippet.description}}</h3>
    </div>
</template>

<script>
export default {
    name: 'PlaylistItem',
    props: ['item']
}
</script>
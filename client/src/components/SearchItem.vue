<template>
    <div>
        <h2>
            {{item.snippet.title}}
        </h2>
        <h3>
            {{item.snippet.description}}
        </h3>
    </div>
</template>

<script>
export default {
    name: 'SearchItem',
    props: ['item']
}
</script>
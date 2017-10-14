<template>

  <form id="postForm" class="form-horizontal" @submit.prevent="submitPost()">
    <div class="form-group">
      <label for="title" class="col-md-2 text-right">Title:</label>
      <div class="col-md-10">
        <input type="text" class="form-control" id="title" placeholder="Input post title." v-model="post.title">
      </div>
    </div>
    <div class="form-group">
      <label class="col-md-2 text-right">Content:</label>
      <div class="col-md-12">
        <textarea class="form-control" v-model="post.body"></textarea>
      </div>
    </div>

    <button class="btn btn-default btn-xs" type="submit">Submit</button>
  </form>

</template>


<script>

  export default {
    name: 'postForm',
    props: {
      posts: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data () {
      return {
        post: {title: '', body: ''}
      }
    },
    methods: {
      submitPost () {
        console.log('>>> submit post form...', this.post)
        if (this.post.title == '' || this.post.body == '') {
          alert('Submit failure! The "title" or "Content" is not empty.')
          return
        }

//        this.axios.post('http://47.52.71.6:8881/api/test', this.post).then(resp => {
//          console.log(resp)
//
//          this.$emit('refresh-posts')
//
//          this.post = {title: '', body: ''}
//        })
        let _post = this.$lodash.clone(this.post)
        this.$store.dispatch('createPost', _post, () => {
          this.post = {title: '', body: ''}
        })
      }
    }
  }

</script>

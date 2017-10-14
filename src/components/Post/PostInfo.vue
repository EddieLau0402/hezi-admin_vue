<template>

  <div id="postInfo">
    <div class="text-center" v-if="loading">Loading...</div>

    <div class="col-md-4 col-md-offset-4" v-if="post">
      <!--<h4>{{ post.title }}</h4>-->
      <!--<div>-->
        <!--<p>{{ post.content }}</p>-->
      <!--</div>-->
      <form class="form-horizontal" @submit.prevent="editPost()">
        <div class="form-group">
          <label for="title" class="col-md-2 text-right">Title:</label>
          <div class="col-md-10">
            <input type="text" class="form-control" id="title" placeholder="Input post title." v-model="post.title">
          </div>
        </div>
        <div class="form-group">
          <label class="col-md-2 text-right">Content:</label>
          <div class="col-md-12">
            <textarea class="form-control" v-model="post.content"></textarea>
          </div>
        </div>

        <button class="btn btn-default btn-xs" type="submit">Edit</button>
        <a class="btn btn-default btn-xs" @click="cancel()">Cancel</a>
      </form>
    </div>

    <div v-if="err">Some wrong...</div>
  </div>

</template>


<script>

  export default {
    name: 'postInfo',
    data () {
      return {
        loading: true,
        err: null,
        post: null,
        id: null
      }
    },
    created () {
      this.id = this.$route.params.id
      this.getPost()
    },
    watch: {
      '$route': 'getPost'
    },
    methods: {
      getPost () {
        this.loading = true
        this.err = this.post = null

        this.axios.get('http://47.52.71.6:8881/api/test/'+this.id).then(resp => {
          console.log(resp)
          this.post = resp.data.data
          this.loading = false
        })
      },

      editPost () {
        this.post.body = this.post.content
        this.axios.put('http://47.52.71.6:8881/api/test/'+this.id, this.post).then(resp => {
          console.log(resp)

          this.cancel()
        })
      },

      cancel () {
        this.$router.replace({name: 'posts'})
      }
    }
  }

</script>

<template>

  <div id="posts" class="container">
    <div class="col-md-6">
      <div v-if="posts.length > 0">
        <p class="text-left">{{ posts.length }} posts in this list.</p>
        <ul class="list-group">
          <li class="post list-group-item text-left clearfix"
              v-for="(post, index) in posts">

            <a class="pull-left">
            <router-link :to="{ name: 'post', params: { id: post.id }}">{{ post.title }}</router-link>
            </a>

            <a class="pull-right btn btn-danger btn-xs btn-post-del" @click="delPost(index, post)"><i class="glyphicon glyphicon-trash"></i> Delete</a>
            <span class="badge" :class="{'badge-success': post.is_free, 'badge-warning': !post.is_free}">{{ post.is_free ? 'Free' : 'Not free' }}</span>
          </li>
        </ul>
      </div>

      <div v-else>No posts!</div>
    </div>

    <div class="col-md-6">
      <add-post :posts="posts" @refresh-posts="getPosts"></add-post>
    </div>

  </div>

</template>

<script>
  import PostForm from './PostForm'

  export default {
    name: 'posts',
    data () {
      return {
//        posts: []
      }
    },

    methods: {
      getPosts () {
//        this.axios.get('http://47.52.71.6:8881/api/test').then(resp => {
//          console.log('>>>>> get posts success...')
//          this.posts = resp.data.data
//        })
        this.$store.dispatch('getPosts')
      },

      delPost (index, post) {
        this.$store.dispatch('removePost', post)
      }
    },

    mounted () {
      /// Get posts
      this.getPosts()
    },
    computed: {
      posts () {
        return this.$store.state.posts
      }
    },

    components: {
      addPost: PostForm
    }

  }
</script>

<style>
  .badge-success {
    background: #5cb85c;
  }
  .badge-danger {
    background: #d9534f;
  }
  .badge-warning {
    background: #f0ad4e;
  }
  .btn-post-del {
    margin: 0 10px;
  }
</style>

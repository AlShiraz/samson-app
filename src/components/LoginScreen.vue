<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">Login</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://188.243.82.176:8005/token', {
          username: this.username,
          password: this.password
        });

        
        const accessToken = response.data.access_token;
        const userName = response.data.person;

        
        localStorage.setItem('auth_token', accessToken);
        localStorage.setItem('userName', userName);

        // alert('Login successful!');

        const jwtPayload = JSON.parse(atob(accessToken.split('.')[1]));
        localStorage.setItem('auth_exp', jwtPayload.exp);

        this.$router.push('/profile');   
      } catch (error) {
        console.log(error)
        this.errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
      }
    }    
  }
};
</script>

<style scoped>
.login-container {
  max-width: 300px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 2px 2px 12px #aaa;
}

.form-group {
  margin-bottom: 15px;
}

.error {
  color: red;
  font-size: 0.9em;
}
</style>

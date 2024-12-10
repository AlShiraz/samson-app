<template>
    <div class="user-page">
      <h2>Welcome, {{ username }}</h2>
      <p>Status: {{ status }}</p>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: localStorage.getItem('auth_username') || '',
        status: 'Checking...',
      };
    },
    async mounted() {
      const token = localStorage.getItem('auth_token');
      const userName = localStorage.getItem('userName');
      try {
        const response = await axios.get('http://188.243.82.176:8005/check', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data === 'good') {
          this.status = 'Authorized';
          this.username = userName;
        } else {
          this.status = 'Not Authorized';
        }
      } catch (error) {
        console.error('Error during authorization:', error);
        this.status = 'Not Authorized';
      }
    },
    methods: {
      logout() {
        localStorage.clear();
        this.$router.push('/');
      },
    },
  };
  </script>
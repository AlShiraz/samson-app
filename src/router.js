import { createRouter, createWebHistory } from 'vue-router'
import LoginScreen from './components/LoginScreen.vue'
import UserProfile from './components/UserProfile.vue'
import axios from 'axios'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: LoginScreen,
    },
    {
        path: '/profile',
        component: UserProfile,
        beforeEnter: async (to, from, next) => {
            const token = localStorage.getItem('auth_token');
            const exp = localStorage.getItem('auth_exp');
            const currentTime = Math.floor(Date.now() / 1000);
    
            if (token && exp > currentTime) {
              next();
            } else if (token && exp <= currentTime) {
              try {
                await refreshAuthToken();
                next();
              } catch (error) {
                console.error('Token refresh failed:', error);
                next('/');
              }
            } else {
              next('/');
            }
          },        
    }
  ]
})

async function refreshAuthToken() {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('No token found');
    alert(token)
  
    const response = await axios.post('http://188.243.82.176:8005/refresh', null, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const newToken = response.data.token;
    localStorage.setItem('auth_token', newToken);
    const jwtPayload = JSON.parse(atob(newToken.split('.')[1]));
    localStorage.setItem('auth_exp', jwtPayload.exp);
  }
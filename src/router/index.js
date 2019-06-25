import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld';
import dept from "@/components/management/dept";
import user from "@/components/management/user";
import constant from "@/components/management/constant";
import disease from "@/components/management/disease";
import non_medic from "@/components/management/non_medic";
import shift from "@/components/management/shift";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/dept',
      name: 'Department',
      component: dept
    },
    {
      path: '/user',
      name: 'Users',
      component: user
    },
    {
      path: '/constant',
      name: 'Constant',
      component: constant
    },
    {
      path: '/disease',
      name: 'Disease',
      component: disease
    },
    {
      path: '/non_medic',
      name: 'Non-medical Charge',
      component: non_medic
    },
    {
      path: '/shift',
      name: 'Shift',
      component: shift
    }
  ]
})

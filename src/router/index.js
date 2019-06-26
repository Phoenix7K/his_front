import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld';
import dept from "@/components/management/dept";
import user from "@/components/management/user";
import constant from "@/components/management/constant";
import disease from "@/components/management/disease";
import non_medic from "@/components/management/non_medic";
import shift from "@/components/management/shift";
import bill from "@/components/register/bill";
import receipt from "@/components/register/receipt";
import register from "@/components/register/register";
import cancel_register from "@/components/register/cancel_register";
import receipt_preview from "@/components/register/receipt_preview";
import dailyrecord from "@/components/financial/dailyrecord";

Vue.use(Router)

export default new Router({
  mode: 'hash',
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
    },
    {
      path: '/bill',
      name: 'Bill',
      component: bill
    },
    {
      path: '/receipt',
      name: 'Receipt',
      component: receipt
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/cancel_register',
      name: 'cancel_register',
      component: cancel_register
    },
    {
      path: '/receipt_preview/:recid',
      name: 'receipt_preview',
      component: receipt_preview
    },
    {
      path: '/dailyrecord',
      name: 'dailyrecord',
      component: dailyrecord
    }
  ]
})

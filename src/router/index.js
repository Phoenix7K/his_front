import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld';
import dept from "@/components/management/dept";
import user from "@/components/management/user";
import constant from "@/components/management/constant";
import disease from "@/components/management/disease";
import non_medic from "@/components/management/non_medic";
import shift from "@/components/management/shift";
import homepage from "@/components/outpatient/homepage";
import frontpage from "@/components/outpatient/homepageSub/frontpage";
import examination from "@/components/outpatient/homepageSub/examination";
import inspection from "@/components/outpatient/homepageSub/inspection";
import treatment from "@/components/outpatient/homepageSub/treatment";
import diagconfirm from "@/components/outpatient/homepageSub/diagconfirm";
import patentmed from "@/components/outpatient/homepageSub/patentmed";
import herbal from "@/components/outpatient/homepageSub/herbal";
import billquery from "@/components/outpatient/homepageSub/billquery";

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
    },
    {
      path: '/homepage',
      name: 'HomePage',
      component: homepage,
      children:[{
        path: '/frontpage',
        component: frontpage,
      },{
        path: '/examination',
        component: examination,
      },{
        path: '/inspection',
        component: inspection,
      },{
        path: '/treatment',
        component: treatment,
      },{
        path: '/diagconfirm',
        component: diagconfirm,
      },{
        path: '/patentmed',
        component: patentmed,
      },{
        path: '/herbal',
        component: herbal,
      },{
        path: '/billquery',
        component: billquery,
      }]
    }
  ]
})

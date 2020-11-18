<!--
 * @Descripttion: 重写helloworld组件
 * @Author: 王月
 * @Date: 2020-09-16 14:29:05
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-11-18 15:32:26
-->
<%# REPLACE %>
<template>
    <div class="hello">
        <h1>Welcome to JK-CLI</h1>
        <p>{{ msg }}</p>
    </div>
</template>
<%# END_REPLACE %>

<%# REPLACE %>
<script>
console.log('----');
console.log('选择的项目类型为<%= InputOptions.projectType %>');
<%_ if (InputOptions.projectType) { _%>
    console.log(111);
<%_ } else { _%>
    console.log(222);
<%_ } _%>
// import {getCoachList} from '../api';
import { testData } from '../json';
export default {
    props: ['msg'],
    data() {
        return {
            data: testData
        }
    },
    created() {
        // console.log(getCoachList);
        console.log(this.data);
    }
}
</script>>
<%# END_REPLACE %>
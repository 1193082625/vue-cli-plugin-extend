/*
 * @Author: ECHO
 * @Date: 2021-03-18 15:00:56
 * @LastEditTime: 2021-03-18 15:01:30
 * @LastEditors: Please set LastEditors
 * @Description: 
 */
import Mock from "mockjs";
import demo from "./demo";
Mock.mock(/\/javaapi\/getDetail/, demo.getDetail);
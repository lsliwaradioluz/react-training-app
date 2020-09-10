export { default as React, Component, useContext, Fragment } from "react";
export { Switch, Route, Link, NavLink, BrowserRouter, Redirect, withRouter } from "react-router-dom"
export { connect } from "react-redux"
export { useQuery } from "@apollo/client"
export { default as apolloClient } from "src/apollo/clientConfig"
export { default as styled, keyframes, css } from "styled-components";
export { default as axios } from "axios";

export const colors = {
  primary: '#1B1E31',
  secondary: '#23283C',
  faded: '#6b6d84',
  headers: '#FDDCBD',
  white: '#ffffff',
  dirtywhite: '#ffffffdc',
}



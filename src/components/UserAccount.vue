<template>
  <div id="container">
    <strong>{{ name }}</strong>
    <p>Hi {{ auth.currentUser!.displayName }}, <a target="_blank" rel="noopener noreferrer" @click.passive="signOut(auth)">Sign Out</a></p>
  </div>
</template>

<script setup lang="ts">

import { auth } from "@/clientHandler";
import { signOut } from "firebase/auth";

defineProps({
  name: String,
});
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>

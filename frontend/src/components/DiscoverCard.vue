<template>
  <v-card>
    <v-tabs v-model="tab" background-color="secondary" grow>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="item in items" :key="item">
        <v-card flat>
          <v-card-text
            >Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatum nostrum molestias ipsa enim fugiat possimus iusto quidem
            minus facere praesentium, voluptatibus vero suscipit dolor, est sed
            ipsam, in illo excepturi!</v-card-text
          >
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
export default {
  name: 'DiscoverCard',
  data: () => {
    return {
      tab: null,
      items: ['Provinces', 'Districts', 'DestiNations']
    }
  }
}
</script>

<style></style>

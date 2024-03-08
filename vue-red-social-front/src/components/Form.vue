<template>
  <v-card :max-width="maxWidth" dark rounded="lg">
    <v-container>
      <v-card-title style="display: flex; justify-content: center">
        {{ title }}
      </v-card-title>
      <v-form
        @submit.prevent="submitForm"
        class="ml-5 mr-5"
        ref="form"
        v-model="valid"
      >
        <v-alert
          dense
          v-if="error"
          color="red"
          elevation="5"
          outlined
          text
          type="error"
          align="center"
          class="mx-1"
        >
          {{ alertValidate }}</v-alert
        >
        <v-alert
          dense
          v-if="errorAlert.value"
          color="red"
          elevation="5"
          outlined
          text
          type="error"
          align="center"
          class="mx-1"
        >
          {{ errorAlert.text }}</v-alert
        >
        <div v-for="(input, i) in inputsForm" :key="'input_' + i + input.name">
          <v-text-field
            :name="input.name"
            v-model="input.data"
            :type="input.type"
            :label="input.label"
            :rules="input.rules"
            outlined
            dense
            :readonly="input.readonly"
            :disabled="input.disabled"
            rounded
          />
        </div>
        <v-row class="justify-space-around pa-4">
          <v-btn class="error" rounded @click="cancel">
            {{ $tc("Login.buttons.cancel") }}
          </v-btn>
          <v-btn type="submit" class="primary" rounded>
            {{ $tc("Login.buttons.submit") }}
          </v-btn>
        </v-row>
      </v-form>
    </v-container>
  </v-card>
</template>

<script>
import Vue from "vue";

export default {
  props: {
    items: {
      type: Array,
    },
    maxWidth: String,
    mode: String,
    title: String,
    errorAlert: {
      type: Object,
    },
  },
  data() {
    return {
      inputsForm: [],
      valid: true,
      error: false,
      alertValidate: "",
    };
  },
  mounted() {
    this.inputsForm = Vue.observable(this.items);
  },
  methods: {
    submitForm(e) {
      e.preventDefault();
      this.validation(e.target);
    },
    handleSubmit(form) {
      const formData = new FormData(form);
      const itemsComplete = {};

      for (let [name, value] of formData) {
        itemsComplete[name] = value;
      }
      this.$refs.form.resetValidation();

      this.$emit("save", itemsComplete);
    },
    validation(form) {
      let valid = this.$refs.form.validate();
      if (valid) {
        this.handleSubmit(form);
      } else {
        this.error = true;
        this.alertValidate = this.$tc("Login.alert.error");
        setTimeout(() => {
          this.error = false;
        }, 2500);
      }
    },
    cancel() {
      this.$refs.form.resetValidation();
      this.$emit("cancel", false);
    },
  },
};
</script>

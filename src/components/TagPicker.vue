<template>
  <div class="tagpicker">
    <nested/>
    <ul class="tagger-main" @click="setFocus" :style="{borderColor: borderColor}">

      <li v-on:dblclick="setEdit(index)" v-for="(tag, index) in tags" class="tagger-tag noselect" v-bind:key="tag" :style="{backgroundColor: tagColor, color: tagTextColor}">
        <span class="clickable">{{tag}}</span>
        <span class="tagger-remove clickable" @click="removeTag(tag, index)">
          &#10006;
        </span>
      </li>

      <li class="tagger-new">
        <input type="text" :id="fieldName" v-model="field" @keydown="fieldUpdate" @blur="lostFocus" :style="{borderColor: tagColor}">
      </li>
    </ul>
  </div>
</template>

<script>
import { CommaKey, TabKey, DeleteKey, SpaceKey, EnterKey } from '../utils/constants';
import { addClass, removeClass, toggleClass } from '../utils/dom';
//Polyfill
function includes(arr, str) {
  return arr.indexOf(str) > -1;
}

import Nested from './Nested'

export default {
  name: 'tag-picker',
  components: { Nested },
  props: {
    //Allow duplicate tags
    allowDuplicates: {
      type: Boolean,
      default: false
    },
    seperator: {
      type: String,
      default: "|"
    },
    addOnKeys: {
      type: Array,
      default: () => [TabKey, EnterKey, CommaKey]
    },
    removeOnKeys: {
      type: Array,
      default: () => [DeleteKey]
    },
    tagsList: {
      default: () => []
    },
    tagColor: {
      type: String,
      default: "#3498db"
    },
    tagTextColor: {
      type: String,
      default: "white"
    },
    fieldName: {
      type: String,
      default: "vue-tag-picker"
    },
    borderColor: {
      type: String,
      default: "#cecece"
    },
    editingClass: {
      type: String,
      default: "editing"
    }
  },
  data() {
    return {
      field: "",
      editing: {
        mode: false,
        original: ""
      },
      tags: []
    }
  },
  methods: {
    setFocus() {
      const inputs = this.$el.getElementsByTagName("input")
      if (inputs.length > 0)
        inputs[0].focus();
    },
    removeTag(tag, i) {
      const start = this.tags.slice(0, i);
      const end = this.tags.slice(i + 1);
      this.tags = start.concat(end);
    },
    lostFocus() {
      if (this.field.trim() !== "") {
        this.addTag();
      }
    },
    updateTag() {
      this.tags[this.editing.original] = this.field;
      //Reset editing and field
      this.editing.mode = false;
      this.field = "";
      this.removeAllEditingClasses();
    },
    showDuplicateError() {
      let current = this.tags.indexOf(this.field);
      let currentEl = this.$el.getElementsByClassName("tagger-tag")[current];
      addClass(this.$el.getElementsByClassName("tagger-tag"), "shake");
      setTimeout(() => toggleClass(currentEl, "shake"), 500);
    },
    addTag() {
      //If we're editing we want to get the tag we're editing
      if (this.editing.mode) {
        //Update the contents
        this.updateTag();
        //Don't continue adding the tag
        return;
      }
      //If no duplicates are allowed and the user is trying to add a dupe. Return early and animate the existing tag
      if (!this.allowDuplicates && includes(this.tags, this.field)) {
        this.showDuplicateError();
        return;
      }
      //If the field has a value, then add it to the tags
      if (!!this.field.trim()) {
        this.tags.push(this.field);
        this.$emit("added", this.field);
      }

      //Reset field
      this.field = "";
    },
    fieldUpdate(e) {
      //If the key is one of the keycodes we use to add a tag, then add
      if (includes(this.addOnKeys, e.keyCode)) {
        this.addTag();
        //If it's a remove keycode and there is no text in the field, delete the last tag.
      } else if (includes(this.removeOnKeys, e.keyCode) && this.field.length === 0) {
        this.tags.pop();
      } else {
        //Return true to propogate
        return true;
      }
    },
    removeAllEditingClasses() {
      let tags = this.$el.getElementsByClassName("tagger-tag");
      for (var tag of tags) {
        removeClass(tag, this.editingClass);
      }
    },
    setEdit(i) {
      let el = this.$el.getElementsByClassName("tagger-tag")[i];
      this.editing = {
        mode: true,
        original: i
      }
      //Reset editing
      this.removeAllEditingClasses();
      toggleClass(el, this.editingClass);
      if(!el) return;
      this.field = el.firstChild.textContent;
    }
  },
  mounted() {
    this.tags = Array.isArray(this.tagsList) ? this.tagsList : this.tagsList.split(this.seperator)
  },
  watch: {
    // whenever question changes, this function will run
    tags(newTag) {
      this.$emit('changed', this.tags);
    }
  }
}
</script>
<style>
.clickable {
  cursor: pointer;
}

.tagger-main {
  font-family: sans-serif;
  letter-spacing: 1px;
  font-size: 0.9rem;
  overflow: auto;
  margin-left: inherit;
  margin-right: inherit;
  list-style: none;
  display: block;
  padding: 6px;
  line-height: 1.42857143;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid;
}


.tagger-main li,
.tagger-main .tagger-new input {
  display: block;
  height: 100%;
  border: none;
  float: left;
  cursor: default;
  margin: 2px 10px 2px 0;
}

.tagger-main .tagger-new input {
  margin-top: 10px;
}

.tagger-main .tagger-new input:focus {
  outline: none;
  border-bottom: 2px solid;
}

.tagger-main .tagger-tag {
  display: inline-block;
  color: white;
  padding: 0.5em;

  margin-left: 5px;
}

.editing {
  background-color: #555 !important;
}

.tagger-main .tagger-remove {
  height: 100%;
  display: inline-block;
}

.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
}

@keyframes shake {
  from,
  to {
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translate3d(-4px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translate3d(4px, 0, 0);
  }
}

.shake {
  animation-name: shake;
  animation-duration: 0.75s;
}

.noselect {
  -webkit-touch-callout: none;
  /* iOS Safari */
  -webkit-user-select: none;
  /* Safari */
  -khtml-user-select: none;
  /* Konqueror HTML */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* Internet Explorer/Edge */
  user-select: none;
  /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
}
</style>

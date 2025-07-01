import {ref} from 'vue';
import Bubble from './Bubble.vue';

const text = ref<string>("");

const updateText = (newText: string) => {
  text.value = newText
}

const hideBubble = () => {
    const bubble = document.querySelector('#bubble') as HTMLElement;
    if (bubble) {
        bubble.style.display = 'none';
    }
}

const showBubble = () => {
    const bubble = document.querySelector('#bubble') as HTMLElement;
    if (bubble) {
        bubble.style.display = 'block';
    }
}

export {text, updateText, hideBubble, showBubble};

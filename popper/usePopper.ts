import { debounce } from 'lodash-es';
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
export const usePopper = ({
	props,
	inputElmtRef,
	containerElmtRef,
	fitInputWidth,
	showCb,
	hideCb,
	theValue,
	theLabel,
}: {
	fitInputWidth?: boolean;
	theLabel: any;
	theValue: any;
	props: any;
	inputElmtRef: any;
	containerElmtRef: any;
	showCb?: Function;
	hideCb?: Function;
}) => {
	let isRendered = false;
	const isShow = ref(false);
	const inputHovering = ref(false);
	let timeout: any;
	const isPopperLock = ref(false);

	const showClose = computed(() => {
		const hasValue = props.multiple ? theValue?.length > 0 : theLabel.value !== '';
		const criteria = props.clearable && !props.disabled && inputHovering.value && hasValue;
		return criteria;
	});

	const onFocus = () => {
		if (props.disabled) return;
		if (isPopperLock.value) return;
		onShow();
		if (!isRendered) {
			containerElmtRef.value!.style.position = 'fixed';
			containerElmtRef.value!.style.zIndex = '3000';
			document.body.appendChild(containerElmtRef.value!);

			isRendered = true;
		}
		onResize();
	};
	const onShow = () => {
		if (timeout) {
			clearTimeout(timeout);
		}
		if (props.disabled) return;
		if (isPopperLock.value) return;
		isShow.value = true;
		if (showCb) showCb();
	};
	const onToggle = () => {
		if (isShow.value) {
			isShow.value = false;
			if (hideCb) hideCb();
		} else {
			onFocus();
		}
	};

	const onBody = (ev: MouseEvent) => {
		if (isShow.value) {
			let target = ev.target as HTMLElement;
			while (target.parentElement) {
				if (target === inputElmtRef.value || target === containerElmtRef.value) return;
				target = target.parentElement;
			}
			isShow.value = false;
			if (hideCb) hideCb();
		}
	};
	const onBlur = () => {
		if (inputElmtRef.value) inputElmtRef.value.blur();
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			isShow.value = false;
			if (hideCb) hideCb();
		}, 200);
	};
	const onHide = () => {
		if (timeout) {
			clearTimeout(timeout);
		}
		if (isPopperLock.value) return;
		timeout = setTimeout(() => {
			isShow.value = false;
			if (hideCb) hideCb();
		}, 200);
	};
	const onResize = debounce(() => {
		if (!isShow.value) return;
		const input = inputElmtRef.value;
		const dom = containerElmtRef.value;
		if (input && dom) {
			if (fitInputWidth) dom.style.width = input.offsetWidth + 'px';
			const rect = input.getBoundingClientRect();
			const rect1 = dom.getBoundingClientRect();
			let left = rect.left;
			if (left + rect1.width > window.innerWidth) {
				left = window.innerWidth - rect1.width;
			}
			let top = rect.top + rect.height;
			if (top + rect1.height > window.innerHeight) {
				top = window.innerHeight - rect1.height;
			}
			dom.style.left = left + 'px';
			dom.style.top = top + 'px';
		}
	}, 100);
	onMounted(() => {
		window.addEventListener('resize', onResize);
		document.addEventListener('mouseup', onBody);
	});
	onBeforeUnmount(() => {
		if (isRendered) {
			document.body.removeChild(containerElmtRef.value);
		}
		window.addEventListener('resize', onResize);
		document.addEventListener('mouseup', onBody);
	});
	return {
		isShow,
		inputHovering,
		isPopperLock,
		showClose,
		onFocus,
		onShow,
		onToggle,
		onBody,
		onBlur,
		onHide,
		onResize,
	};
};

<template>
	<div style="width: 100%">
		<div
			:class="{
				'el-input': true,

				'is-disabled': disabled,
				'el-input--suffix': !disabled,
				'is-focus': isShow,
			}"
			style="width: 100%"
			ref="inputRef"
			@mouseenter="inputHovering = true"
			@mouseleave="inputHovering = false"
		>
			<div class="el-input__wrapper">
				<input
					@click="onFocus()"
					:disabled="disabled"
					placeholder="请输入泵房关键词搜索"
					v-model="theLabel"
					@keyup.enter="onShow()"
					class="el-input__inner"
				/>

				<span v-if="!disabled" class="el-input__suffix">
					<span class="el-input__suffix-inner">
						<el-icon class="el-input__icon" v-show="!showClose" @click="onToggle()">
							<ArrowUp v-if="isShow" />
							<ArrowDown v-else />
						</el-icon>
						<el-icon class="el-input__icon" @click="onClear" v-if="showClose"><CircleClose /></el-icon>
					</span>
				</span>
			</div>
		</div>

		<div
			v-if="!disabled"
			v-show="isShow && !disabled"
			class="el-popper is-light el-popover select-container"
			ref="containerRef"
			@mouseenter="onFocus()"
			@mouseover="onShow()"
		>
			<el-tree
				ref="treeRef"
				style="max-width: 600px; padding-bottom: 8px"
				:data="showData"
				show-checkbox
				default-expand-all
				node-key="id"
				highlight-current
				@check-change="onCheckTree"
				:props="{ children: 'monitorPointList', label: 'label' }"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { usePopper } from './usePopper';
import { apiPointList } from '/@/api/baoguan/record';
import { checkRes } from '/@/api/luofang/rule';
const containerRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLDivElement>();
const dataList = ref<any[]>([]);
const loading = ref(false);
const props = withDefaults(
	defineProps<{
		modelValue: string[] | string;
		disabled?: boolean;
		multiple?: boolean;
		clearable?: boolean;
	}>(),
	{}
);
const theValue = ref(props.modelValue);
const theLabel = ref('');
const { isShow, inputHovering, showClose, onFocus, onShow, onToggle } = usePopper({
	fitInputWidth: true,
	containerElmtRef: containerRef,
	inputElmtRef: inputRef,
	props,
	theLabel,
	theValue,
});
const showData = computed(() => {
	return dataList.value;
});
const onClear = () => {};
const getData = async () => {
	loading.value = true;
	try {
		const res = await apiPointList();

		if (checkRes(res)) {
			dataList.value = res.data;
		}
	} catch (err) {
		console.log(err);
	}
	loading.value = false;
};
getData();
</script>

<style lang="scss" scoped>
.select-container {
	position: fixed;
	min-width: 200px;
	z-index: 3000;
	width: 260px;
	height: 300px;
	scrollbar-width: none;
	overflow: hidden auto;
}
</style>

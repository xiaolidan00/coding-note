module.exports = {
    name: 'DataTable',
    meaning: '数据表格',

    props: {
        rowKey: { type: String, meaning: '行唯一标识的字段' },
        data: {
            type: Array,
            meaning: '表格数据',
            default: () => [],
        },
        marginTop: { type: Number, default: 20, meaning: '表格上方边距' },
        tableSize: {
            type: String,
            default: 'small',
            options: ['medium', 'small', 'mini'],
            meaning: '表格尺寸',
        },
        loading: { type: Boolean, meaning: '加载状态' },
        total: { type: Number, default: 0, meaning: '数据总条数,用于分页' },
        size: { type: Number, default: 10, meaning: '每页展示数量', isSync: true },
        config: {
            type: Array,
            default: () => [],
            meaning: '表格配置',
        },
        isPager: {
            type: Boolean,
            default: true,
            meaning: '是否显示分页',
        },
        page: {
            type: Number,
            default: 1,
            meaning: '当前页码',
            isSync: true,
        },
        radioVal: {
            type: [Number, String],
            default: '',
            meaning: '单选框选中值',
            isSync: true,
        },
        isSelection: {
            type: Boolean,
            default: false,
            meaning: '是否开启多选',
        },
        tableHeight: { type: [String, Number], default: 'auto', meaning: '高度' },

        spanMethod: { type: Function, meaning: '合并行列函数' },
    },
    events: {
        'update:size': { meaning: '每页展示数量改变', params: 'size' },
        'update:page': { meaning: '当前页码改变', params: 'page' },
        change: { meaning: '当前页码改变', params: 'page' },
        'update:radioVal': { meaning: '单选框选中值改变', params: 'radioVal' },
    },
    slots: {
        '[prop]Slot': {
            meaning: 'prop属性的插槽',
            params: '$index, row, column',
        },
    },
    codes: [
        {
            title: '根据行数自适应高度,不显示分页',
            template: ` <DataTable
                    :config="accessTable"
                    tableHeight="row"
                    :data="tableData"
                    :loading="loading.tableLoading"
                    :isPager="false"
                >
                    <template slot-scope="{ row }" slot="processSlot">
                        <span v-if="row.num > 0" type="text" style="color: #1faaad">已接入</span>
                        <span v-else style="color: orange">未接入</span>
                    </template>

                    <template slot-scope="{ row }" slot="operateSlot">
                        <el-button v-if="row.isView" type="text" @click="onView(row)">查看</el-button>
                        <span v-else-if="row.module === '组态'">
                            <el-button v-if="row.num == 0" type="text" @click="onTakeOver">接入</el-button>
                            <el-button type="text" v-if="row.num > 0 || true" @click="onMange(row)">管理</el-button>
                        </span>
                        <el-button v-else type="text" @click="onMange(row)">管理</el-button>
                    </template>
                </DataTable>`,
            js: `export const accessTable = [
    {
        label: '序号',
        type: 'index',
        prop: 'index',
        width: 80,
    },
    {
        label: '模块',
        align: 'left',
        prop: 'module',
        width: 120,
        
        showOverflowTooltip: true,
    },
    {
        label: '接入进度',
        align: 'left',
        prop: 'process',
        width: 120,
        isSlot: true,
    },
    {
        label: '接入数量',
        align: 'left',
        prop: 'num',
        width: 120,
    },
    {
        label: '操作',
        prop: 'operate',
        align: 'center',
        width: 200,
        fixed: 'right',
        isSlot: true,
    },
];`,
        },
        {
            title: '填充父级表格，显示分页',
            template: ` <DataTable :data="tableData" :config="tableConfig" :loading="loading" :isPager="false">
                    <template slot="nameSlot" slot-scope="{ row }">
                        <div :class="['alarm-tag', row.highlight == 1 ? 'active' : '']">{{ row.name }}</div>
                    </template>
                    <template slot="operateSlot" slot-scope="{ row }">
                        <el-button type="text" @click="onRowAction('edit', row)">编辑</el-button>
                        <el-button type="text" @click="onRowAction('del', row)">删除</el-button>
                    </template>
                </DataTable>`,
            js: `export const tableConfig = [
    { label: '标签名称', prop: 'name', isSlot: true, showOverflowTooltip: true,sortable:true },
    { label: '标签描述', prop: 'description', showOverflowTooltip: true },
    {
        label: '高亮显示',
        prop: 'highlight',
        formatter: (row) => {
            return row.highlight == 1 ? '是' : '否';
        },
    },
    { label: '创建人', prop: 'createBy' },
    {
        label: '创建时间',
        minWidth: 100,
        align: 'left',
        prop: 'createTime',
        showOverflowTooltip: true,
        sortable: 'custom',
        sortableName: 'start_time',
    },
    { label: '操作', prop: 'operate', isSlot: true },
]`,
        },
    ],
};

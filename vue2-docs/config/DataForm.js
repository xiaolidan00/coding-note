module.exports = {
    name: 'DataForm',
    meaning: '数据表单',
    description: '用于展示和编辑数据的表单组件，支持多种布局和配置',
    props: {
        showValue: { type: Boolean, meaning: '显示值的文本，用于详情回显', default: false },
        columnGap: {
            type: Number,
            meaning: '列间距',
            default: 20,
        },
        rowGap: {
            type: Number,
            meaning: '行间距',
            default: 30,
        },
        inline: { type: Boolean, meaning: '排列在一行', default: false },
        config: {
            type: Array,
            meaning: '表单配置',
            default: () => [],
        },
        dictMap: {
            type: Object,
            meaning: '字典映射',
            default: () => ({}),
        },
        value: {
            type: Object,
            meaning: '表单数据',
            isVModel: true,
            default: () => ({}),
        },
        isFlowLastFill: {
            type: Boolean,
            meaning: '是否最后一项填满剩余空间',
            default: false,
        },
        isFlow: {
            type: Boolean,
            meaning: '是否流式布局',
            default: false,
        },
    },
    events: {
        'update:value': { meaning: 'formData改变', params: 'formData' },
        change: { meaning: 'formData改变', params: 'formData' },
        'change[prop]': {
            meaning: 'prop属性值变化时触发',
            params: 'configItem, value',
        },
    },
    slots: {
        '[prop]Slot': {
            meaning: 'prop属性的插槽',
            params: '',
        },
    },
    codes: [
        {
            title: '搜索条件',
            template: `<el-form
                    @submit.native.prevent
                    :model="params"
                    ref="queryForm"
                    size="small"
                    :inline="true"
                    label-width="68px"
                >
                    <DataForm
                        v-model="params"
                        :config="searchFormConfig"
                        :columnGap="10"
                        @changetype="handleQuery"
                        @changekeyword="handleQuery"
                    >
                        <template slot="idsSlot">
                            <el-form-item
                                :label="\`选择\${params.type == 1 ? '区域' : '组织'}\`"
                                prop="ids"
                                style="margin: 0px !important"
                            >
                                <AreaSelect
                                    v-if="params.type == 1"
                                    v-model="params.areaIds"
                                    :multiple="true"
                                    :selectAll="true"
                                    @change="getList"
                                    style="width: 230px"
                                ></AreaSelect>

                                <OrgSelect
                                    v-if="params.type == 2"
                                    v-model="params.deptIds"
                                    :selectAll="true"
                                    :multiple="true"
                                    @change="getList"
                                    style="width: 230px"
                                ></OrgSelect>
                            </el-form-item>
                        </template>
                        <div style="text-align: right" slot="btnSlot">
                            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
                            <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>                         
                        </div>
                    </DataForm>
                </el-form>`,
            js: `export const defaultSearch1 = {
    type: '1',
    deptIds: [],
    keyword: '', 
    areaIds: [],
    current: 1,
    size: 10,
};

export const searchFormConfig = [
    {
        span: 3,
        inputType: 'radioBtn',
        prop: 'type',
        options: [
            { label: '区域', value: 1 },
            { label: '组织', value: 2 },
        ],
    },
    {
        span: 7,
        isSlot: true,
        prop: 'ids',
    },
    {
        span: 7,
        label: '模糊搜索',
        inputType: 'text',
        prop: 'keyword',
        placeholder: '泵房名称/地址/编号/曾用名',
    },
    {
        span: 7,
        isSlot: true,
        prop: 'btn',
    },
];`,
        },
        {
            title: '信息表单',
            template: ` <el-form :model="formData" ref="formRef" label-width="100px" @submit.native.prevent>
                    <DataForm
                        v-model="formData"
                        :config="formConfig"
                        @changeoperatorTeamId="onTeam"
                        :dictMap="{ operatorTeamList, teamPersonList, currentUser }"
                    >
                        <template slot="pumpStationIdSlot">
                            <PumpPicker
                                placeholder="请选择泵房"
                                v-model="formData.pumpStationId"
                                :disabled="isPump"
                                @select="onSelectPump"
                            ></PumpPicker>
                        </template>
                        <template slot="pumpStationDeptIdSlot">
                            <OrgSelect disabled v-model="formData.pumpStationDeptId"></OrgSelect>
                        </template>
                    </DataForm>
                </el-form>
            </div>`,
            js: `export const defaultForm = {
    pumpStationId: '',
    pumpStationDeptId: '',
    pumpStationName: '',
    type: '',
   takeOverTime: '',
    title: '',
    urgencyLevel: '',
    disposeLevel: '',
    takeOverStatus: '',
 address:'',
 title:'',
 supplyBuilds:0
};

export const formConfig = [
{
        label: '工单类型',
        prop: 'type',
        inputType: 'select',
        isDict: true,
        dict: 'workorder_type',
        span: 12,
        required: true,
    },
    {
        label: '计划工单',
        prop: 'isPlan',
        inputType: 'select',
        span: 12,
        options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
        ],
    },
  {
        span: 8,
        label: '供水楼栋数',
        inputType: 'num',

        prop: 'supplyBuilds',
    },
    { label: '运维泵房', prop: 'pumpStationId', inputType: 'slot', span: 12, required: true },
    { label: '所属组织', prop: 'pumpStationDeptId', inputType: 'slot', span: 12, disabled: true, required: true },
    { label: '工单地址', prop: 'address', inputType: 'text', span: 24, required: true },
    { label: '工单标题', maxlength: 50, prop: 'title', inputType: 'text', span: 24, required: true },
   {
        span: 8,
        label: '接管情况',
        inputType: 'select',
        prop: 'takeOverStatus',
        dict: 'station_takeover',
        isDict: true,
        required: true,
    },
    {
        span: 8,
        label: '接管时间',
        inputType: 'date',
        disabledFunc: (form) => {
            return form.takeOverStatus == '3';
        },
        prop: 'takeOverTime',
        dateFormat: 'yyyy-MM-dd HH:mm:ss',
    }, { label: '处理组织', prop: 'operatorTeamId', inputType: 'select', dict: 'operatorTeamList', span: 12 },
];`,
        },
    ],
};

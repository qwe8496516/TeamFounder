import { useState, useEffect } from 'react'
import { Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd'
import dayjs from 'dayjs'

const { Option } = Select
const { RangePicker } = DatePicker

const TEAM_FORMATION_TYPES = {
  SELF_SELECTED: 'Self-selected',
  RANDOM: 'Random'
}

function ActivityModal({ isOpen, onClose, onSubmit, initialData }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.setFieldsValue({
          ...initialData,
          duration: initialData.startTime && initialData.endTime ? 
            [dayjs(initialData.startTime), dayjs(initialData.endTime)] : null
        })
      } else {
        form.resetFields()
      }
    }
  }, [isOpen, initialData, form])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const [startTime, endTime] = values.duration || []
      const formattedValues = {
        ...values,
        startTime: startTime ? startTime.format('YYYY-MM-DD') : null,
        endTime: endTime ? endTime.format('YYYY-MM-DD') : null
      }
      delete formattedValues.duration
      await onSubmit(formattedValues)
      form.resetFields()
      onClose()
    } catch (error) {
      console.error('Validation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={initialData ? "Edit Activity" : "New Activity"}
      open={isOpen}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={initialData ? "Save Changes" : "Create Activity"}
      cancelText="Cancel"
      width={600}
      centered
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          teamFormationType: TEAM_FORMATION_TYPES.SELF_SELECTED,
          minTeamSize: 2,
          maxTeamSize: 4
        }}
        preserve={false}
      >
        <Form.Item
          name="title"
          label="title"
          rules={[{ required: true, message: 'Please enter title' }]}
        >
          <Input placeholder="e.g., Project Team Formation" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter activity description' }]}
        >
          <Input.TextArea 
            rows={4}
            placeholder="Enter activity description and requirements..."
          />
        </Form.Item>

        <Form.Item
          name="teamFormationType"
          label="Team Formation Type"
          rules={[{ required: true, message: 'Please select team formation type' }]}
        >
          <Select>
            <Option value={TEAM_FORMATION_TYPES.SELF_SELECTED}>Self-selected</Option>
            <Option value={TEAM_FORMATION_TYPES.RANDOM}>Random</Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="minTeamSize"
            label="Minimum Team Size"
            rules={[{ required: true, message: 'Please enter minimum team size' }]}
          >
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>

          <Form.Item
            name="maxTeamSize"
            label="Maximum Team Size"
            rules={[{ required: true, message: 'Please enter maximum team size' }]}
          >
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>
        </div>

        <Form.Item
          name="duration"
          label="Activity Duration"
          rules={[{ required: true, message: 'Please select activity duration' }]}
        >
          <RangePicker 
            format="YYYY-MM-DD"
            className="w-full"
            placeholder={['Start Date', 'End Date']}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ActivityModal 
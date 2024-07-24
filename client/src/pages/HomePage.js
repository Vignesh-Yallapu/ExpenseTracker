import React,{useState, useEffect} from 'react';
import { Form, Input, Modal, Select, Table, message, DatePicker } from 'antd';
import Layout from '../componenets/Layout/Layout';
import Spinner from '../componenets/Layout/Spinner';
import axios from 'axios';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const {RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal,setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedDate] = useState([]);
  const [type,setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [editable, setEditable] = useState(null);

  // table data
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title: 'Amount',
      dataIndex: 'amount'
    },
    {
      title: 'Type',
      dataIndex: 'type'
    },
    {
      title: 'Category',
      dataIndex: 'category'
    },
    {
      title: 'Reference',
      dataIndex: 'reference'
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ]
  
  // useEffect Hook
  useEffect(() => {
    // get all transactions
    const getAllTransactions = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        setLoading(true);
        const res = await axios.post('/api/v1/transactions/get-transaction', {userid: user._id,frequency,selectedDate, type, category});
        setLoading(false);
        setAllTransaction(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
        message.error('Failed to fetch transactions');
      }
    };
    getAllTransactions();
  }, [frequency, selectedDate,type, category]);
  // form handling
  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/api/v1/transactions/edit-transaction", {
          payload: {
            ...values,
            userId: user._id,
          },
          transacationId: editable._id,
        });
        setLoading(false);
        message.success("Transaction Updated Successfully");
      } else {
        await axios.post("/api/v1/transactions/add-transaction", {
          ...values,
          userid: user._id,
        });
        setLoading(false);
        message.success("Transaction Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction");
    }
  };
  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("/api/v1/transactions/delete-transaction", {
        transacationId: record._id,
      });
      setLoading(false);
      message.success("Transaction Deleted!");
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("unable to delete");
    }
  };
  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="7">Last 1 Week</Select.Option>
            <Select.Option value="30">Last 1 Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          {frequency === 'custom' && <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="Income">INCOME</Select.Option>
            <Select.Option value="Expense">EXPENSE</Select.Option>
          </Select>
        </div>

        <div>
          <h6>Select Category</h6>
          <Select value={category} onChange={(values) => setCategory(values)}>
              <Select.Option value="all">All</Select.Option>
              <Select.Option value="Salary">Salary</Select.Option>
              <Select.Option value="Tip">Tip</Select.Option>
              <Select.Option value="Project">Project</Select.Option>
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Movie">Movie</Select.Option>
              <Select.Option value="Medical">Medical</Select.Option>
              <Select.Option value="Travel">Travel</Select.Option>
              <Select.Option value="Tax">Tax</Select.Option>
              <Select.Option value="Fee">Fee</Select.Option>
          </Select>
        </div>
        
        <div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        <Table columns={columns} dataSource={allTransaction} />
      </div>
      <Modal title="Add Transaction" open={showModal} onCancel={() => setShowModal(false)} footer={null}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Amount" name="amount">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Type" name="type">
            <Select>
              <Select.Option value="Income">Income</Select.Option>
              <Select.Option value="Expense">Expense</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Category" name="category">
            <Select>
              <Select.Option value="Salary">Salary</Select.Option>
              <Select.Option value="Tip">Tip</Select.Option>
              <Select.Option value="Project">Project</Select.Option>
              <Select.Option value="Food">Food</Select.Option>
              <Select.Option value="Movie">Movie</Select.Option>
              <Select.Option value="Medical">Medical</Select.Option>
              <Select.Option value="Travel">Travel</Select.Option>
              <Select.Option value="Tax">Tax</Select.Option>
              <Select.Option value="Fee">Fee</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Date" name="date">
            <Input type="date" />
          </Form.Item>
          <Form.Item label="Reference" name="reference">
            <Input type="text" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>
          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;

import { useState } from 'react';
import { PieChart, Pie, Cell, Legend } from 'recharts';

function Site() {
  const initialData = [
    { id: 1, canal: "Channel 1", amount: 100 },
    { id: 2, canal: "Channel 2", amount: 200 },
    { id: 3, canal: "Channel 3", amount: 300 },
  ];

  const [data, setData] = useState(initialData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newCanal, setNewCanal] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [originalCanal, setOriginalCanal] = useState('');
  const [originalAmount, setOriginalAmount] = useState('');


  const handleRemoveUser = (canal: string) => {
    const updatedData = data.filter(item => item.canal !== canal);
    setData(updatedData);
  };

  const handleEditUser = (index: number) => {
    const item = data[index];
    setEditingIndex(index);
    setOriginalCanal(item.canal);
    setOriginalAmount(item.amount.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const regex = /^[0-9]*$/;

    if (regex.test(value)) {
      const updatedData = [...data];
      updatedData[index].amount = parseInt(value);
      setData(updatedData);
    }
  };

  const handleDiscard = (index: number) => {
    const updatedData = [...data];
    updatedData[index].canal = originalCanal;
    updatedData[index].amount = parseInt(originalAmount);
    setData(updatedData);
    setEditingIndex(null);
  };

  const handleSaveChanges = () => {
    setEditingIndex(null);
  };

  const handleAddNew = () => {
    if (parseInt(newAmount) <= 0) {
      alert('You cannot insert canal with a value of 0 or lower');
      return;
    }

    const existingChannel = data.find(item => item.canal === newCanal);
    if (existingChannel) {
      alert(`The channel "${newCanal}" already exists, try editing it instead of creating the same one.`);
      return;
    }

    const newData = [...data, { id: data.length + 1, canal: newCanal, amount: parseInt(newAmount) }];
    setData(newData);
    setNewCanal('');
    setNewAmount('');
  };

  const canalData = data.reduce((acc: { [key: string]: number }, item) => {
    acc[item.canal] = (acc[item.canal] || 0) + item.amount;
    return acc;
  }, {});

  const totalAmount = Object.values(canalData).reduce((acc, amount) => acc + amount, 0);
  const chartData = Object.keys(canalData).map((canal) => ({
    name: canal,
    value: Math.round((canalData[canal] / totalAmount) * 100),
  }));

  const COLORS = [
    '#001f3f',
    '#003d79',
    '#005cb3',
    '#007bff',
    '#54a8ff',
    '#7fcdff',
    '#a9e3ff',
    '#d3f0ff',
    '#e6f5ff',
  ];

  return (
    <div className="container">
      <div className="data-section">
        <div className="input-section">

          <input
            className="input-canal"
            id="cnl"
            type="text"
            placeholder="Canal"
            value={newCanal}
            onChange={(e) => setNewCanal(e.target.value)}
          />

          <input
            className="input-amount"
            id="amt"
            type="number"
            placeholder="Amount"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
          />

          <button className="btn-add" onClick={handleAddNew}>Add New Canal</button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Canal</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.canal}>
                <td>
                  {editingIndex === index ? (
                    item.canal
                  ) : (
                    <span>{item.canal}</span>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <input
                      className="input-amount"
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleInputChange(e, index)}
                    />
                  ) : (
                    <span>{item.amount}</span>
                  )}
                </td>
                <td>
                  {editingIndex === index ? (
                    <>
                      <button className="btn-discard" onClick={() => handleDiscard(index)}>Discard</button>
                      <button className="btn-save" onClick={() => handleSaveChanges()}>Save</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-remove" onClick={() => handleRemoveUser(item.canal)}>Remove</button>
                      <button className="btn-edit" onClick={() => handleEditUser(index)}>Edit</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="chart-section">
        <PieChart width={300} height={300}>
          <Pie
            dataKey="value"
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            fill="#8884d8"
            label={({ value }) => `${value}%`}
          >
            {chartData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend
            align="center"
            layout="horizontal"
            verticalAlign="bottom"
            iconSize={12}
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </div>
    </div>
  );
}

export default Site;

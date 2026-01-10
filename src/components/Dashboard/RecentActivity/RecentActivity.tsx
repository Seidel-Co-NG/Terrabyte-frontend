import './RecentActivity.css';

interface Activity {
  title: string;
  description: string;
  time: string;
}

const RecentActivity = () => {
  const activities: Activity[] = [
    {
      title: 'New Order Received',
      description: 'New order #12345 of amount $450.00 is created by jane doe.',
      time: 'Today 02:25'
    },
    {
      title: 'Payment Processed',
      description: 'Payment of $320.50 has been processed successfully.',
      time: 'Today 01:15'
    },
    {
      title: 'Product Updated',
      description: 'StrideMax Sneakers inventory has been updated.',
      time: 'Yesterday 11:30'
    },
    {
      title: 'New Customer',
      description: 'New customer registration: Alice Smith',
      time: 'Yesterday 09:45'
    },
  ];

  return (
    <div className="recent-activity">
      <div className="widget-header">
        <h3 className="widget-title">Recent Activity</h3>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="activities-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-indicator">
              <div className="activity-dot"></div>
            </div>
            <div className="activity-content">
              <div className="activity-title">{activity.title}</div>
              <div className="activity-description">{activity.description}</div>
              <div className="activity-time">{activity.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;


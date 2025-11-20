'use client';

import React, { useEffect, useRef } from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const $ = dynamic(() => import('jquery'), { ssr: false });
const Daterangepicker = dynamic(
  () => import('daterangepicker').then((mod) => mod.default),
  { ssr: false }
);

if (typeof window !== 'undefined') {
  require('daterangepicker/daterangepicker.css');
}

const DateRangePicker = ({ placeholder = 'Start Date - End Date', value, handleChangeRange }) => {
  const reportRangeRef = useRef(null);

  useEffect(() => {
    const initializeDateRangePicker = () => {
      if (!$.fn.daterangepicker) {
        console.error('Date Range Picker plugin not loaded.');
        return;
      }

      const start = value?.startDate ? moment(value.startDate) : null;
      const end = value?.endDate ? moment(value.endDate) : null;

      function cb(start, end) {
        $(reportRangeRef.current)
          .find('span')
          .html(
            start && end
              ? `${start.format('MMM D, YYYY')} - ${end.format('MMM D, YYYY')}`
              : placeholder
          );

        if (start && end) {
          handleChangeRange({ start: start.toDate(), end: end.toDate() });
        }
      }

      $(reportRangeRef.current)?.daterangepicker(
        {
          ...((start && end) && {
            startDate: start,
            endDate: end,
          }),
          ranges: {
            Today: [moment(), moment()],
            Yesterday: [
              moment().subtract(1, 'days'),
              moment().subtract(1, 'days'),
            ],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [
              moment().subtract(1, 'month').startOf('month'),
              moment().subtract(1, 'month').endOf('month'),
            ],
          },
        },
        cb
      );

      cb(start, end);
    };

    if (reportRangeRef.current) {
      initializeDateRangePicker();
    } else {
      console.error('Ref not initialized.');
    }

    return () => {
      $(reportRangeRef.current)?.data('daterangepicker')?.remove();
    };
  }, [value, placeholder, handleChangeRange]);

  return (
    <div
      id="reportrange"
      ref={reportRangeRef}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        background: '#fff',
        cursor: 'pointer',
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
      }}
    >
      <span></span>
      <FuseSvgIcon size={20} className="ml-12">
        feather:calendar
      </FuseSvgIcon>
    </div>
  );
};

export default DateRangePicker;
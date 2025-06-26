"use client";

import DynamicTable from "@/app/components/dynamicTable/dyamicTable";

// src/app/dashboard/page.tsx

export default function ListingPage() {
  const churchData = [
    {
      id: "uuid-1234-abcd-5678-efgh",
      type: "member",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "555-123-4567",
      memberSince: "2020-03-15",
      isActive: true,
      ministries: ["Worship", "Outreach"],
      notes: "Regular attendee, volunteers for events.",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zip: "90210",
      },
      birthDate: "1985-07-20",
    },
    {
      id: "uuid-5678-efgh-1234-abcd",
      type: "member",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      phoneNumber: "555-987-6543",
      memberSince: "2018-09-01",
      isActive: true,
      ministries: ["Children's Ministry", "Fellowship"],
      notes: "Team lead for Sunday School.",
      address: {
        street: "456 Oak Ave",
        city: "Anytown",
        state: "CA",
        zip: "90210",
      },
      birthDate: "1990-01-10",
    },
    {
      id: "uuid-9012-ijkl-3456-mnop",
      type: "event",
      eventName: "Community BBQ",
      date: "2025-07-20", // Future date
      time: "1:00 PM",
      location: "Church Backyard",
      description: "Annual community barbecue with games and food.",
      attendeesExpected: 150,
      isRecurring: false,
      contactPerson: "john.doe@example.com",
      ministry: "Outreach",
    },
    {
      id: "uuid-3456-mnop-9012-ijkl",
      type: "sermon",
      title: "The Power of Forgiveness",
      speaker: "Pastor David Lee",
      date: "2025-06-23", // Past date
      durationMinutes: 45,
      bibleVerses: ["Matthew 6:14-15", "Colossians 3:13"],
      audioUrl: "https://example.com/sermons/forgiveness.mp3",
      tags: ["forgiveness", "grace", "faith"],
    },
    {
      id: "uuid-7890-qrst-1234-uvwx",
      type: "ministry",
      name: "Youth Ministry",
      description: "Engaging programs and activities for youth.",
      leader: "Jane Smith",
      contactEmail: "youth@example.com",
      activeMembers: 35,
      eventsPlannedThisMonth: 3,
    },
    {
      id: "uuid-2345-wxyz-6789-abcd",
      type: "ministry",
      name: "Worship Ministry",
      description: "Leading the congregation in praise and worship.",
      leader: "Michael Johnson",
      contactEmail: "worship@example.com",
      activeMembers: 20,
      eventsPlannedThisMonth: 8,
    },
    {
      id: "uuid-6789-abcd-2345-wxyz",
      type: "donation",
      donorId: "uuid-1234-abcd-5678-efgh",
      amount: 100.0,
      currency: "USD",
      date: "2025-06-20",
      fund: "General Offering",
      isRecurring: false,
    },
    {
      id: "uuid-1122-3344-5566-7788",
      type: "donation",
      donorId: "uuid-5678-efgh-1234-abcd",
      amount: 50.0,
      currency: "USD",
      date: "2025-06-18",
      fund: "Building Fund",
      isRecurring: true,
    },
  ];
  return (
    <>
      <div className="bg-gray-900 p-2">
        {/* <h1 className="text-2xl font-bold">Panel principal de inventarios </h1> */}
        <DynamicTable
          data={churchData}
          title="Plantilla de inventarios"
          rowsPerPage={10}
          actionButton={{
            label: "➕ Agregar Pago",
            onClick: () => alert("Nueva acción ejecutada"),
          }}
        />
      </div>
    </>
  );
}

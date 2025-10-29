# Car Management Guide

This guide explains how to use the car management feature in your Fuel Logbook app.

## Overview

The car management system allows users to:
- Add multiple cars to their account
- Track fuel entries separately for each car
- Set a default car for quick entry
- Edit car details (make, model, year, registration)
- Delete cars (if they have no fuel entries)

## Prerequisites

- Supabase authentication must be set up and working
- Database schema must include the `cars` table
- User must be logged in

## Adding Your First Car

### Step 1: Access Car Management

1. Log in to your account
2. Click the "Manage Cars" button in the header
3. The car management dialog will open

### Step 2: Add Car Details

Fill in the following information:

- **Make** (required): The car manufacturer (e.g., Toyota, Ford, Honda)
- **Model** (required): The car model (e.g., Camry, F-150, Civic)
- **Year** (optional): The manufacturing year
- **Registration Number** (optional): Your license plate number
- **Set as default**: Toggle this to make it your default car

### Step 3: Save

Click "Add Car" to save your car to the database.

## Managing Multiple Cars

### Adding More Cars

1. Open the car management dialog
2. Scroll to the "Add New Car" section
3. Fill in the details for your new car
4. Click "Add Car"

### Setting a Default Car

The default car is automatically selected when creating new fuel entries:

1. Open car management
2. When adding or editing a car, toggle "Set as default car"
3. Only one car can be default at a time
4. The previous default will be automatically unset

### Editing a Car

1. Open car management
2. Find the car you want to edit
3. Click the pencil icon
4. Update the details
5. Click "Update Car"

### Deleting a Car

**Important**: You cannot delete a car that has fuel entries.

1. Open car management
2. Find the car you want to delete
3. Click the trash icon
4. Confirm the deletion

If the car has fuel entries, you'll see an error message. You must either:
- Delete all fuel entries for that car first, OR
- Reassign the fuel entries to another car

## Using Cars with Fuel Entries

### Creating Fuel Entries

When creating a new fuel entry:

1. Select a car from the dropdown (your default car is pre-selected)
2. Fill in the fuel details
3. The entry will be linked to the selected car

### Viewing Entries by Car

The fuel entries list shows which car each entry belongs to:
- Look for the car name/model in each entry
- Filter entries by car (if filtering is implemented)

### Calculating Fuel Economy per Car

Each car tracks its own fuel economy:
- km/L is calculated based on that car's previous entries
- Different cars will have different fuel economy statistics

## API Endpoints

The car management system uses these API endpoints:

### GET /api/cars
Fetches all cars for the current user

**Response:**
\`\`\`json
{
  "cars": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "make": "Toyota",
      "model": "Camry",
      "year": 2020,
      "registration_number": "ABC-123",
      "is_default": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
\`\`\`

### POST /api/cars
Creates a new car

**Request Body:**
\`\`\`json
{
  "make": "Honda",
  "model": "Civic",
  "year": 2021,
  "registration_number": "XYZ-789",
  "is_default": false
}
\`\`\`

### PUT /api/cars/[id]
Updates an existing car

**Request Body:** Same as POST

### DELETE /api/cars/[id]
Deletes a car (only if it has no fuel entries)

## Database Schema

### Cars Table

\`\`\`sql
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  registration_number TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, registration_number)
);
\`\`\`

### Fuel Entries Relationship

\`\`\`sql
ALTER TABLE fuel_entries ADD COLUMN car_id UUID REFERENCES cars(id);
\`\`\`

## Best Practices

### Registration Numbers

- Use a consistent format (e.g., ABC-123 or ABC123)
- Registration numbers must be unique per user
- Leave blank if you don't want to track registration

### Default Car

- Set your most frequently used car as default
- This saves time when creating fuel entries
- You can change the default at any time

### Organizing Multiple Cars

If you have many cars:
1. Use clear, descriptive names
2. Include the year to distinguish similar models
3. Keep registration numbers up to date
4. Delete cars you no longer own (after archiving their data)

## Troubleshooting

### Issue: "A car with this registration number already exists"

**Cause**: You're trying to add a car with a registration number that's already in your account

**Solution**: 
- Check your existing cars
- Use a different registration number
- Leave the registration field blank

### Issue: "Cannot delete car with existing fuel entries"

**Cause**: The car has fuel entries linked to it

**Solution**:
1. Go to fuel entries
2. Delete all entries for this car, OR
3. Keep the car in your account (you can edit it instead)

### Issue: Car not showing in dropdown

**Cause**: Car wasn't saved properly or page needs refresh

**Solution**:
1. Refresh the page
2. Check if the car appears in car management
3. Try adding the car again if it's missing

### Issue: Default car not pre-selected

**Cause**: No car is set as default

**Solution**:
1. Open car management
2. Edit a car and toggle "Set as default car"
3. Save the changes

## Future Enhancements

Potential features to add:
- Car photos/images
- Fuel tank capacity
- Recommended fuel type
- Maintenance tracking per car
- Insurance expiry reminders
- Service history
- Car value tracking

## Security

- Users can only see their own cars
- Row Level Security (RLS) prevents cross-user access
- All API endpoints verify user authentication
- Car IDs are UUIDs (not sequential numbers)

## Support

If you encounter issues with car management:
1. Check that you're logged in
2. Verify Supabase is properly configured
3. Check browser console for errors
4. Review the database schema
5. Ensure RLS policies are enabled

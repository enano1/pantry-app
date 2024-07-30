"use client";
import { firestore } from '@/firebase';
import { Box, Stack, Typography, Button, TextField } from '@mui/material';
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
      pantryList.push({ name: doc.id, count: doc.data().count });
    });
    console.log('Pantry List:', pantryList);  // Debug log
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    // Check if exists
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await setDoc(docRef, { count: docSnap.data().count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const currentCount = docSnap.data().count;
      if (currentCount > 1) {
        await setDoc(docRef, { count: currentCount - 1 });
      } else {
        await deleteDoc(docRef);
      }
      await updatePantry();
    }
  };


  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add
      </Button>

      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant="h2" color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="800px" height="200px" spacing={2} overflow={'auto'}>
          {pantry.map((item) => (
            <Box
              key={item.name}
              width="100%"
              minHeight="100px"
              display={"flex"}
              justifyContent={"space-between"}
              paddingY={5}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
              paddingX={5}
            >
              <Typography variant={"h5"} color={'#333'} textAlign={'center'} fontWeight="normal">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant={"h5"} color={'#333'} textAlign={'center'} fontWeight="normal">
                Quantity: {item.count}
              </Typography>
              <Button variant="contained" onClick={() => removeItem(item.name)}>Remove</Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

const express = require('express');
const path = require('path');
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'coc-vjti',
	api_key: '552242973352355',
	api_secret: process.env.CLOUDINARY_SECRET
});
const Event = require('../models/Event')

module.exports = {
	async getEvents(_req, res) {
		const events = await Event.find();
		res.json(events);
	},
	async getEventById(req, res) {
		const eventId = req.params.id;
		const event = await Event.findById(eventId);
		res.json(event);
	},
	async uploadEvent(req, res) {
		try {

			const file = req.file;
			console.log(req.file)
			const image = cloudinary.v2.uploader.upload(file.path);
			req.body.image = {
				url: image.secure_url,
				public_id: image.public_id
			};
			
			const event = await Event.create(req.body);
			res.json({
				"id": event._id
			});
		} catch (err) {
			res.status(203).send({
				err: err
			})
		}
	},
	async updateEvent(req, res) {
		const eventId = req.params.id;
		const event = await Event.findById(eventId);
		res.json({
			"id": event._id
		});
	},
	async deleteEvent(_req, res) {
		const eventId = req.params.id;
		const event = await Event.findById(eventId);
		await event.remove();
		res.status(204);
	},
}
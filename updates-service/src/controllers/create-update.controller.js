const { z } = require('zod');
const { createUpdate } = require('../db');

const UpdateTypeSchema = z.union([
  z.literal('created'),
  z.literal('updated'),
  z.literal('deleted')
]);

const updateDataObject = z.object({
  type: UpdateTypeSchema,
  date: z.string().datetime({ offset: true }),
  target: z.number().int('Target id must be number'),
  ip: z
    .string()
    .regex(
      /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/,
      'ip address validation failed'
    ),
  data: z.any().optional()
});

const createUpdateController = async (req, res) => {
  try {
    const data = updateDataObject.parse(req.body.update);
    await createUpdate(data);

    res.json({
      message: 'Update created'
    });
  } catch (error) {
    res.status(400);
    res.json({
      error: 'Update data error'
    });
  }
};

module.exports = createUpdateController;

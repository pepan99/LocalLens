export type ActionResult = Success | Error;

export type Success = {
  type: "success";
  message: string;
};

export type Error = {
  type: "error";
  message: string;
};

export type ActionResultWithData<T> =
  | {
      type: "success";
      data: T;
    }
  | Error;
